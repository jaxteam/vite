import { createMemoryHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import MicroApp, {MicroRoutes, MicroContext } from './index'
describe('测试路由', function () {
    // it("memory",function(){
    //     history.push("/hello/abc")
    // })
    function hello(props: any) {
        // console.log(props)
        return React.createElement("div", "", "hello")
    }
    const routes: MicroRoutes<any, MicroContext> = [{
        path: '/hello/:id',
        component: () => hello,
        engine: function (component: JSX.Element, element: HTMLElement) {
            ReactDOM.render(component, element)
            return element
        }
    }, {
        path: "/html",
        component: () => () => "<div>html</div>",
        engine: function (component: string, element: HTMLElement) {
            element.innerHTML = component
            return element
        }
    }, {
        path: '/dom',
        component: () => () => document.createElement("h1"),
        engine: function (component: HTMLElement, element: HTMLElement) {
            element.appendChild(component)
            return element
        }
    }]

    const app = new MicroApp({
        history: createMemoryHistory({
            initialEntries: ["/"],
            initialIndex: 0
        }),
        routes:routes,
    }).render(document.body)


    it("memory html", function () {
        app.push("/html")
    })

    it('memory dom', function () {
        app.push("/dom")
    })

    it('micro addRouter',function(){
        app.addView({
            path:'/new',
            name:"new",
            component:() => () => "<div>new</div>",
            engine:function (component: string, element: HTMLElement) {
                element.innerHTML = component
                return element
            }
        })

        app.push("/new")
        expect("/new").toBe(app.findURL("new"))
        app.push(app.findURL("new"))
    })
})