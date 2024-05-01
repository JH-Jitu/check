import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src", "app", "api", "mock-api");

const mockAPIHandler = async (req) => {
  // const router = useRouter()
  console.log({ req });
  const { query, url, method } = req;

  const urlFor = new URL(url);
  const searchParams = new URLSearchParams(urlFor.searchParams);
  const resource = searchParams.get("resource");
  const id = searchParams.get("id");
  const projectId = searchParams.get("projectId");
  console.log({ id });
  // const { id } = query || {};

  if (!resource) {
    return new NextResponse(
      JSON.stringify({ error: "Resource parameter is missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  // const filePath = path.join(dataDirectory, `${resource}.json`);
  // const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  // console.log({ filePath, data });
  try {
    const filePath = path.join(dataDirectory, `${resource}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log({ filePath, data });
    switch (method) {
      case "GET":
        if (resource === "tasks") {
          const items = data.map(
            (d) => d.projectId === parseInt(projectId) && d
          );
          if (items) {
            return new NextResponse(JSON.stringify(items), {
              headers: { "Content-Type": "application/json" },
            });
          } else {
            return new NextResponse(
              JSON.stringify({ error: "Item not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }
        }
        if (id) {
          const item = data.find((d) => d.id === parseInt(id));
          if (item) {
            return new NextResponse(JSON.stringify(item), {
              headers: { "Content-Type": "application/json" },
            });
          } else {
            return new NextResponse(
              JSON.stringify({ error: "Item not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }

          getData(resource === "tasks" ? projectId : id);
        } else {
          return new NextResponse(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
          });
        }
      case "POST":
        async function streamToString(stream) {
          const chunks = [];
          for await (const chunk of stream) {
            chunks.push(chunk);
          }
          return Buffer.concat(chunks).toString("utf8");
        }
        const body = await streamToString(req.body);
        const payload = JSON.parse(body);
        const newItem = {
          ...JSON.parse(body),
          id: data.length + 1,
          projectId: payload?.projectId
            ? parseInt(payload?.projectId)
            : undefined,
        };
        data.push(newItem);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return new NextResponse(JSON.stringify(newItem), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      case "PUT":
        console.log("working here");
        if (id) {
          const itemIndex = data.findIndex((d) => d.id === parseInt(id));

          // console.log({ body: body });
          async function streamToString(stream) {
            const chunks = [];
            for await (const chunk of stream) {
              chunks.push(chunk);
            }
            return Buffer.concat(chunks).toString("utf8");
          }
          const body = await streamToString(req.body);

          console.log({ body });
          if (itemIndex !== -1) {
            const updatedItem = {
              ...JSON.parse(body),
              id: parseInt(id),
            };
            data[itemIndex] = updatedItem;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return new NextResponse(JSON.stringify(updatedItem), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          } else {
            return new NextResponse(
              JSON.stringify({ error: "Item not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }
        } else {
          return new NextResponse(
            JSON.stringify({ error: "Item ID is required" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      case "DELETE":
        if (id) {
          const itemIndex = data.findIndex((d) => d.id === parseInt(id));
          if (itemIndex !== -1) {
            data.splice(itemIndex, 1);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return new NextResponse(null, {
              status: 204,
              headers: { "Content-Type": "application/json" },
            });
          } else {
            return new NextResponse(
              JSON.stringify({ error: "Item not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }
        } else {
          return new NextResponse(
            JSON.stringify({ error: "Item ID is required" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      default:
        return new NextResponse(
          JSON.stringify({ error: "Method not allowed" }),
          { status: 405, headers: { "Content-Type": "application/json" } }
        );
    }
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export default mockAPIHandler;
