import {render} from "react-nil";
import {createElement, FC} from "react";

export const createWorkerApp = (app: FC<{
    worker?: Worker,
}>) => {
    render(createElement(app, {
        worker: self as unknown as Worker,
    }), null)
}