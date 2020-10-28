const Fetch = async (url: string): Promise<any> => {
  if(!url) {
    throw new Error("wrong param url");
  }
  const res = await fetch(url);
  const rv = await res.json();
  if (res.ok) {
    return rv;
  }
}
export default Fetch;