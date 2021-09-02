import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
//@ts-ignore
import VueApp from './App.vue'
import MicroApp, { MicroContext, MicroRoutes } from './router'
import { createApp,Component } from 'vue'
import { createHashHistory } from 'history'
import microRender from './router/engine'
//@ts-ignore
import SvelteApp from './App.svelte'
//
microRender.registerRender('svelte',function(component:any,element:HTMLElement){
  new component({
    target:element
  })
  return element
})
// custom render react element
microRender.registerRender('react',function (component: JSX.Element, element: HTMLElement) {
  ReactDOM.render(component, element)
  return element
})

// custom render vue compoment
microRender.registerRender('vue',function(component:Component,element:HTMLElement){
  createApp(component).mount(element)
  return element
})

const routes: MicroRoutes<any, MicroContext> = [{
  path: '/react',
  component: (context:MicroContext,props:any) => () => <App></App>,
  engine: microRender.getRender('react')
},
{
  path: '/html',
  component: (context:MicroContext,props:any) => () => "html",
  engine: microRender.getRender('html')
}, {
  path: '/dom',
  component: (context:MicroContext,props:any)=> () => {
    const element = document.createElement("h1")
    element.innerText="你好"
    return element
  },
  engine: microRender.getRender('dom')
},{
  path:'/svelte',
  component:(context:MicroContext,props:any)=>()=>SvelteApp,
  engine:microRender.getRender('svelte')
},{
  path:'/vue',
  component:(context:MicroContext,props:any)=>()=>{
    return VueApp
  },
  engine: microRender.getRender('vue')
}]

const app = new MicroApp({
  routes,
  history: createHashHistory()
  //@ts-ignore
}).render(document.getElementById("root"))

// app.push('/')
