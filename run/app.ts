class Fruit {
    name: string;
    color: string;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color
    }
}

const mango = new Fruit('mango', 'yellow')

console.log(mango)