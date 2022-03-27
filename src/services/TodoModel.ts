export default function TodoModel(newTodos: any) {
    const todos = ["todo 1", "todo 2"];
    todos.push(newTodos[0]);
    todos.push(newTodos[1]);
    const lastChange = null;

    function addToPrivateList() {
        console.log("addToPrivateList");
    }
    function add() { console.log("add"); }   
    function reload() { }

    // return Object.freeze({
    //     todos,
    //     add,
    //     reload
    // });

    return {
        todos,
        add,
        reload
    };
}