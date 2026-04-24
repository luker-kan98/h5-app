import links from "@/content/links.json";

export const SearchUrl = (searchText) => {
  return links.filter((item) =>
    item.zh.includes(searchText) || item["zh-CN"].includes(searchText)
  );
}