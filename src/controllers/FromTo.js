import { Core } from "../core/Core"

export class FromTo extends Core {

  static DEFAULTS = {
    ...Core.DEFAULTS,
    dynamic: false, // in dynamic state you can update from and to values during animation
    from: null,
    to: null
  }

  _refreshDynamicProps() {
    super._refreshDynamicProps()
    this._processFromTo()
  }

  _processFromTo() {
    this._lerps = []

    if (!this.target) return

    this._setupStates()
    this._createLerps()
  }

  _setupStates() {
    this._from = this.settings.from || this._createState(this.settings.to || {}, this.target);
    this._to = this.settings.to || this._createState(this.settings.from || {}, this.target);
  }

  _createState(origPattern = {}, origSource = {}, origTarget = {}) {
    const _copyProperty = (pattern, source, target) => {
      for (const key in pattern) {
        typeof pattern[key] === 'object'
          ? (target[key] = {}, _copyProperty(pattern[key], source[key], target[key]))
          : target[key] = source[key]
      }
    }

    _copyProperty(origPattern, origSource, origTarget)
    return origTarget
  }

  _createLerpStep(target, objFrom, objTo, propName) {
    if (this.settings.dynamic) {
      return () => {
        target[propName] = Core.lerp(objFrom[propName], objTo[propName], this.easeValue)
      }

    } else {
      const objFromProperty = objFrom[propName]
      const staticDelta = objTo[propName] - objFromProperty

      return () => {
        target[propName] = objFromProperty + staticDelta * this.easeValue
      }

    }
  }

  _createLerps(target = this.target, from = this._from, to = this._to) {
    for (const key in to) {
      typeof to[key] === 'object'
        ? this._createLerps(target[key], from[key], to[key])
        : this._lerps.push(this._createLerpStep(target, from, to, key))
    }
  }

  _update() {
    super._update()
    for (const callback of this._lerps) {
      callback()
    }
  }

  from(from = {}) {
    this.tweak({ from })
    return this
  }

  to(to = {}) {
    this.tweak({ to })
    return this
  }

  swap() {
    this.tweak({ from: this.settings.to, to: this.settings.from })
    return this
  }
}
