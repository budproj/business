import { HelloService } from './hello.service';
export declare class HelloController {
    private readonly helloService;
    constructor(helloService: HelloService);
    getHello(): string;
}
