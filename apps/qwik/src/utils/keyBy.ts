export const keyBy =
  (key: string) =>
  (arr: any[]): { [key: string]: any } =>
    arr.reduce(
      (acc, cur) => ({
        ...acc,
        [cur[key]]: cur,
      }),
      {}
    );
