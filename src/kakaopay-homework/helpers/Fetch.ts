import HandleError from "./HandleError";

const Fetch = async (url: string): Promise<any> => {
  const res = await fetch(url);
  const rv = await res.json();
  if (res.ok) {
    return rv;
  }
  HandleError({message: '데이터를 받아오는데 실패했습니다.'});
  return [];
}
export default Fetch;