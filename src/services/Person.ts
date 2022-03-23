export default function Person(this: any, name: string, age: string, isDeveloper: boolean) {
    this.name = name;
    this.age = age;
    this.isDeveloper = isDeveloper || false;

    this.writesCode = function () {
        console.log(this.isDeveloper ? "This person does write code" : "This person does not write code");
    }
}