type IsReachBoundary = [boolean, boolean];
class ScrollService {
  readonly directions = ['horizontal', 'vertical'];
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
    let result: IsReachBoundary = [false, false];
    if (el.scrollLeft <= offset) {
      result = [true, false];
    } else if (el.scrollLeft + el.clientWidth >= el.scrollWidth - offset) {
      result = [false, true];
    }
    return result;
  }

  // 纵向滚动条是否到达边界
  hasReachVerticalBoundary (el: HTMLElement, offset = 0): IsReachBoundary {
    let result: IsReachBoundary = [false, false];
    if (el.scrollTop <= offset) {
      result = [true, false];
    } else if (el.scrollTop + el.clientHeight >= el.scrollHeight - offset) {
      result = [false, true];
    }
    return result;
  }

  // 获取滚动方向
  getDirection (el: HTMLElement) {
    let result = '';
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
