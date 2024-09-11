import { Core } from "../core/Core"

export class FromTo extends Core {

  static DEFAULTS = {
    ...Core.DEFAULTS,
    dynamic: false, // в динамическом состоянии можно обновлять значения from и to во время анимации
    from: null,
    to: null
  }

  _refreshDynamicProps() {
    super._refreshDynamicProps()
    this._processFromTo()
  }

  _processFromTo() {
    if (!this.target) {
      this._updateFromTo = Core._noop
      this._from = {}
      this._to = {}
    } else {
      this._from = this.settings.from || this._createState(this.settings.to || {}, this.target)
      this._to = this.settings.to || this._createState(this.settings.from || {}, this.target)
      
      if (this.settings.dynamic) {
        this._updateFromTo = this._updateDynamic.bind(this)
      } else {
        this._lerps = []
        this._createLerps(this.target, this._from, this._to)
        this._updateFromTo = this._updateStatic.bind(this)
      }
    }
  }

  _createState(origPattern = {}, origSource = {}, origTarget = {}) {
    const _copyProperty = (pattern, source, target) => {
      for (const key in pattern) {
        typeof pattern[key] === 'object'
          ? target[key] = {} && _copyProperty(pattern[key], source[key], target[key])
          : target[key] = source[key]
      }
    }

    _copyProperty(origPattern, origSource, origTarget)
    return origTarget
  }

  _createLerpStep(target, objFrom, objTo, propName) {
    const staticDelta = objTo[propName] - objFrom[propName]

    return (easeValue) => {
      target[propName] = objFrom[propName] + staticDelta * easeValue
    }
  }

  _createLerps(target, from, to) {
    for (const key in to) {
      typeof to[key] === 'object'
        ? this._createLerps(target[key], from[key], to[key])
        : this._lerps.push(this._createLerpStep(target, from, to, key))
    }
  }

  _update() {
    super._update()
    this._updateFromTo()
  }

  _updateStatic() {
    this._lerps.forEach(lerpStep => lerpStep(this.easeValue))
  }

  _updateDynamic(target = this.target, from = this._from, to = this._to) {
    for (const key in to) {
      typeof to[key] === 'object'
        ? this._updateDynamic(target[key], from[key], to[key])
        : target[key] = from[key] + (to[key] - from[key]) * this.easeValue
    }
  }

  from(newFrom = {}) {
    this.tweak({ from: newFrom })
    this._processFromTo()
    return this
  }

  to(newTo = {}) {
    this.tweak({ to: newTo })
    this._processFromTo()
    return this
  }

  swap() {
    const temp = this._from
    this._from = this._to
    this._to = temp

    if (!this.settings.dynamic) {
      this._lerps = []
      this._createLerps(this.target, this._from, this._to)
    }

    return this
  }
}
