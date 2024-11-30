import { Core } from "../core/Core"

export class FromTo extends Core {
  static DEFAULTS = {
    ...Core.DEFAULTS,
    dynamic: false,
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
      this._recreateLerps()
    } else {
      this._updateFromTo = Core._noop
      this._from = {}
      this._to = {}
    }
  }

  _createState(pattern = {}, source = {}, target = {}) {
    for (const key in pattern) {
      if (typeof pattern[key] === 'object' && pattern[key] !== null) {
        target[key] = {}
        this._createState(pattern[key], source[key], target[key])
      } else {
        target[key] = source[key]
      }
    }
    return target
  }

  _lerp(a, b, t) {
    return a + (b - a) * t
  }

  // Определение метода _recreateLerps
  _recreateLerps() {
    this._createLerps()
  }

  _createLerps() {
    const lines = []
    const dynamic = this.settings.dynamic

    const generateCode = (targetPath, fromPath, toPath, objFrom, objTo) => {
      for (const key in objTo) {
        const currentTargetPath = `${targetPath}['${key}']`
        const currentFromPath = `${fromPath}['${key}']`
        const currentToPath = `${toPath}['${key}']`
        const fromValue = objFrom[key]
        const toValue = objTo[key]

        if (typeof toValue === 'object' && toValue !== null) {
          generateCode(currentTargetPath, currentFromPath, currentToPath, fromValue, toValue)
        } else {
          if (dynamic) {
            lines.push(`${currentTargetPath} = this._lerp(${currentFromPath}, ${currentToPath}, this.easeValue);`)
          } else {
            const delta = toValue - fromValue
            lines.push(`${currentTargetPath} = ${fromValue} + ${delta} * this.easeValue;`)
          }
        }
      }
    }

    generateCode('this.target', 'this._from', 'this._to', this._from, this._to)

    const functionBody = lines.join('\n')
    this._updateFromTo = new Function(functionBody).bind(this)
  }

  _update() {
    super._update()
    this._updateFromTo()
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
    this._recreateLerps()
    return this
  }
}


