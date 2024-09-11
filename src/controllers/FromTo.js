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
    if (this.target) {
      this._from = this.settings.from || this._createState(this.settings.to || {}, this.target)
      this._to = this.settings.to || this._createState(this.settings.from || {}, this.target)

      if (this.settings.dynamic) {
        this._updateFromTo = this._updateDynamic
      } else {
        this._recreateLerps()
        this._updateFromTo = this._updateStatic
      }
    } else {
      this._updateFromTo = Core._noop
      this._from = {}
      this._to = {}
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

    return () => {
      target[propName] = objFrom[propName] + staticDelta * this.easeValue
    }
  }

  _recreateLerps() {
    this._lerps = []
    this._createLerps()
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
    this._updateFromTo()
  }

  _updateStatic() {
    this._lerps.forEach(lerpStep => lerpStep())
  }

  _updateDynamic(target = this.target, from = this._from, to = this._to) {
    for (const key in to) {
      typeof to[key] === 'object'
        ? this._updateDynamic(target[key], from[key], to[key])
        : target[key] = from[key] + (to[key] - from[key]) * this.easeValue
    }
  }

  from(from = {}) {
    this.tweak({ from })
    this._processFromTo()
    return this
  }

  to(to = {}) {
    this.tweak({ to })
    this._processFromTo()
    return this
  }

  swap() {
    [this._from, this._to] = [this._to, this._from]
    if (!this.settings.dynamic) this._recreateLerps()
    return this
  }
}
