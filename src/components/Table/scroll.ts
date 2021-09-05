import { ScrollDirection } from "./types";

export type IsReachBoundary = [boolean, boolean];
class ScrollService {
  readonly directions: [ScrollDirection, ScrollDirection] = ['horizontal', 'vertical'];
  private scrollRecords: [number, number] = [0, 0];
  constructor () {}

  setScroll (el: HTMLElement, value: number, top = true) {
    if (el) {
      const method = top ? 'scrollTop' : 'scrollLeft';
      el[method] = value;
    }
  }

  // 滚动条是否到达边界
  hasReachBoundary (el: HTMLElement, direction = this.directions[1], offset = 0): IsReachBoundary {
    let result: IsReachBoundary = [false, false];
    if (el) {
      if (direction === this.directions[1]) {
        result = this.hasReachVerticalBoundary(el, offset);
      } else {
        result = this.hasReachHorizontalBoundary(el, offset);
      }
    }
    return result;
  }

  // 横向滚动条是否到达边界
  hasReachHorizontalBoundary (el: HTMLElement, offset = 0): IsReachBoundary {
    if (el.scrollLeft <= offset) {
      return [true, false];
    } else if (el.scrollLeft + el.clientWidth >= el.scrollWidth - offset) {
      return [false, true];
    }
    return [false, false];
  }

  // 纵向滚动条是否到达边界
  hasReachVerticalBoundary (el: HTMLElement, offset = 0): IsReachBoundary {
    if (el.scrollTop <= offset) {
      return [true, false];
    } else if (el.scrollTop + el.clientHeight >= el.scrollHeight - offset) {
      return [false, true];
    }
    return [false, false];
  }

  // 获取滚动方向
  getDirection (el: HTMLElement): ScrollDirection {
    let result: ScrollDirection = 'vertical';
    if (el.scrollLeft !== this.scrollRecords[0]) {
      this.scrollRecords[0] = el.scrollLeft;
      result = this.directions[0];
    } else if (el.scrollTop !== this.scrollRecords[1]) {
      this.scrollRecords[1] = el.scrollLeft;
      result = this.directions[1];
    }
    return result;
  }
}

export default new ScrollService();
