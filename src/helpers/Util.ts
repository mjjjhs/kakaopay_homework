const Util: any = {
  addClass: (el: HTMLElement, addName: string) => {
    const addNameArr = addName.split(' ');
    addNameArr.map((addName: string) => el.classList.add(addName));
  },
  replaceClass: (el: HTMLElement, oldName: string, newName: string) => el.classList.replace(oldName, newName)
}
export default Util;