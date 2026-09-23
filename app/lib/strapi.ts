const { STRAPI_TOKEN } = process.env;

export const query = <T>(url: string): Promise<T> => {
  return fetch(`${process.env.STRAPI_HOST}/api/${url}`, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
  }).then((res) => res.json() as Promise<T>);
};
