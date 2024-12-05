import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const data = event.body;
  console.log(data);
  return {
    statusCode: 200,

    body: JSON.stringify({
      message: "Hello World",
    }),
  };
};
