import { Renderer2, RendererStyleFlags2, Type } from '@angular/core';
import { Container, ContainerChild, Text, TextStyle } from 'pixi.js';
import { setCustomProps, TextValue } from '../utils';
import { CommentContainer, ELEMENT_NAME } from '../constants';

export class PixijsRenderer implements Renderer2 {
  constructor(
    private delegate: Renderer2,
    private canvasElementStorage: Map<string, Type<Container<ContainerChild>>>,
    private debug = false
  ) {}

  destroyNode(node: any): void {
    this.debug && console.log('destroyNode', node);
    node.destroy({ children: true });
  }

  addClass(el: any, name: string): void {
    this.debug && console.log('addClass', el, name);
  }

  appendChild(parent: any, newChild: any): void {
    this.debug && console.log('appendChild', parent, newChild);

    if (parent instanceof Container && newChild instanceof Container) {
      parent.addChild(newChild);
      return;
    }

    if (newChild instanceof TextValue) {
      let text = new Text({
        text: newChild.value,
      });
      if (parent instanceof Text) {
        text = parent;
      }
      newChild.textNode = text;
      if (parent instanceof Text) {
        parent.text = newChild.value;
        return;
      } else {
        newChild = text;
      }
    }
    try {
      this.delegate.appendChild(parent, newChild);
    } catch (e) {
      console.warn('Check your template of your PixiJs component. The element must not contain HTML or you find bug:)');
    }

  }

  createComment(value: string): any {
    this.debug && console.log('createComment', value);
    return new CommentContainer();
  }

  createElement(name: string, namespace?: string | null): any {
    this.debug && console.log('createElement', name, namespace);
    name = name.replace('stage-', '');
    const CanvasEntity = this.canvasElementStorage.get(name);

    if (CanvasEntity) {
      const el = new CanvasEntity();
      setCustomProps(el, ELEMENT_NAME, name);
      setCustomProps(el, 'getAttribute', () => {});
      setCustomProps(el, 'removeAttribute', () => {});
      return el;
    }

    return this.delegate.createElement(name, namespace);
  }

  createText(value: string): any {
    this.debug && console.log('createText', value);
    return new TextValue(value.trim());
  }

  get data(): { [p: string]: any } {
    this.debug && console.log('data');
    return {};
  }

  destroy(): void {
    this.debug && console.log('destroy');
  }

  insertBefore(
    parent: Container,
    newChild: Container,
    refChild: Container,
  ): void {
    this.debug && console.log('insertBefore', parent, newChild, refChild);
    const index = parent.children.findIndex((i) => i.uid === refChild.uid);

    parent.addChildAt(newChild, index);
  }

  listen(
    target: any,
    eventName: string,
    callback: (event: any) => boolean | void
  ): () => void {
    this.debug && console.log('listen', target, eventName, callback);
    target.on(eventName, callback, target);
    return () => target.off(eventName, callback, target);
  }

  nextSibling(node: any): any {
    !this.debug && console.log('nextSibling', node);
  }

  parentNode(node: any): any {
    this.debug && console.log('parentNode', node, node.parent);

    return node.parent || this.delegate.parentNode(node);
  }

  removeAttribute(el: any, name: string, namespace?: string | null): void {
    !this.debug && console.log('removeAttribute', el, name, namespace);
  }

  removeChild(parent: any, oldChild: any, isHostElement?: boolean): void {
    this.debug && console.log('removeChild', parent, oldChild, isHostElement);
    if (!parent) {
      parent = oldChild.parent;
    }
    if (!parent || !parent.children) return;
    const index = parent.children.findIndex((i: any) => i.uid === oldChild.uid);
    parent.removeChildAt(index);
  }

  removeClass(el: any, name: string): void {
    this.debug && console.log('removeClass', el, name);
  }

  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    this.debug && console.log('removeStyle', el, style, flags);
  }

  selectRootElement(selectorOrNode: any, preserveContent?: boolean): any {
    this.debug && console.log('selectRootElement', selectorOrNode);
  }

  setAttribute(
    el: any,
    name: string,
    value: string,
    namespace?: string | null
  ): void {
    this.debug && console.log('setAttribute', el, name, value, namespace);

    if (typeof name === 'string' && name.startsWith('ng-reflect')) {
      return;
    }
    const number = parseFloat(`${value}`);
    el[name] = isNaN(number) ? value : number;

    // const number = parseFloat(`${value}`);
    // el[name] = isNaN(number) ? value : (number as E[V]);
  }

  setProperty(el: any, name: string, value: any): void {
    this.debug && console.log('setProperty', el, name, value);

    if (typeof el[name] === 'function') {
      const params = typeof value === 'string' ? value.split(',') : [value];
      el[name](...params);
      return;
    } else {
      el[name] = value;
    }
  }

  setStyle<S extends keyof TextStyle>(
    el: Text | Container,
    style: S,
    value: TextStyle[S],
    flags?: RendererStyleFlags2
  ): void {
    this.debug && console.log('setStyle', el, style, value, flags);
    if (el instanceof Text) {
      el.style[style] = value;
      return;
    }
    el.children
      .filter((i): i is Text => i instanceof Text)
      .forEach((i) => (i.style[style] = value));
  }

  setValue(node: any, value: string): void {
    this.debug && console.log('setValue', node, value);
    if (node instanceof TextValue && node.textNode instanceof Text) {
      node.textNode.text = value;
    }
  }
}
