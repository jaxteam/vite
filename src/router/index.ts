import UniversalRouter, { Route, RouteParams, RouterContext, Routes } from "universal-router";
import generateUrls from 'universal-router/generateUrls'
import {Update,History } from "history"

export type RenderEngine = (component:any, element: HTMLElement)=>HTMLElement

export interface  MicroRoute<R = any, C extends RouterContext = RouterContext> extends Route{
    component:(context:MicroContext,params:any)=>any
    engine:RenderEngine
}

export interface MicroContext extends RouterContext{
    
}

export type MicroRoutes<R = any, C extends RouterContext = RouterContext> = Array<MicroRoute<R, C>>

export interface MicroAppOptions{
    history:History;
    routes:MicroRoutes;
    // element:HTMLElement
}


class MicroApp{
    private history:History;
    private router:UniversalRouter;
    constructor(options:MicroAppOptions){
        this.history = options.history
        this.router = this.initRouter(options)
    }
    /**
     * 获始化 UniversalRouter 对象
     * @param options 
     * @returns UniversalRouter 
     */
    initRouter(options:MicroAppOptions){
        const universalConfig = {
            action: async function (context: RouterContext) {
                console.log('middleware: start')
                const child = await context.next()
                console.log('middleware: end')
                return child
            },
            resolveRoute: function (context: RouterContext, params: RouteParams) {
                if ((context.route?.preAction && context.route?.preAction(context, params) || context.route?.preAction === undefined) && typeof context.route.component === 'function') {
                    const shadowHost = document.createElement("div")
                    const shadowRoot = shadowHost.attachShadow({mode:"open"})
                    return context.route.engine(context.route.component(context, params)(context, params), shadowRoot)
                }
                return undefined
            }
        }
        return new UniversalRouter(options.routes, {
            resolveRoute: universalConfig.resolveRoute
        })  
    }

    /**
     * 添加子路由配置
     * @param router MicroRoute 对象
     */

    addView(router:MicroRoute){
        this.router.root.children?.push(router)
    }

    getRoutes(){
        return this.router.root
    }
    push(pathname:string){
        this.history.push(pathname)
    }
    /**
     * 查找指定route URL完整地址
     * @param name route 指定名称
     * @param params route 路由param 参数，用于格式化 route 变量名称 
     * @returns 
     */
    findURL(name:string,params?:any){
        return generateUrls(this.router)(name)
    }

    /**
     * 渲染组件
     * @param dom 挂载节点
     * @returns 
     */
    render(dom:HTMLElement):MicroApp{
        var self = this
        self.history.listen(function (update: Update) {
            self.router.resolve(update.location.pathname).then(component => {
                dom.innerHTML=""
                dom.appendChild(component)
                // console.log(dom.innerHTML,component)
            })
        }) 
        return self 
    }

}

export default MicroApp
