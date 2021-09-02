
export type RenderEngine = (component: any, element: HTMLElement) => HTMLElement


class MicroRender {
    private renderEngine: any = {}

    registerRender(name: string, render: RenderEngine) {
        this.renderEngine[name] = render
    }

    getRender(name: string) {
        return this.renderEngine[name]
    }
}

const microRender = new MicroRender()

// render html string 
microRender.registerRender('html', function (component: string, element: HTMLElement) {
    element.innerHTML = component
    return element
})

// redner html dom
microRender.registerRender('dom', function (component: HTMLElement, element: HTMLElement) {
    element.appendChild(component)
    return element
})

export default microRender
