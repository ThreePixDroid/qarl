import { Core } from "../core/Core"

export class Curve extends Core {
  static DEFAULTS = {
    ...Core.DEFAULTS,
    properties: null,
    points: [],
    smoothing: 20,
    // useLerp: true,
    // path: [],
    // speed: 1,
  }

  _preparePropertySetters() {
    this.propertySetters = this.properties.map(property => {
      const keys = property.split('.')
      const lastKey = keys.pop()

      return (value) => {
        let obj = this.target
        for (let i = 0; i < keys.length; i++) {
          obj = obj[keys[i]]
        }
        obj[lastKey] = value
      }
    })
  }

  _generatePath() {
    const points = this.settings.points
    const smoothing = Math.max(this.settings.smoothing, 1)

    const result = []
    this.totalLength = 0

    function interpolate(p0, p1, p2, p3, t) {
      const t2 = t * t
      const t3 = t2 * t

      return p0.map((_, i) =>
        0.5 * (
          (2 * p1[i]) +
          (-p0[i] + p2[i]) * t +
          (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 +
          (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3
        )
      )
    }

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1]

      for (let t = 0; t < smoothing; t++) {
        const pt = interpolate(p0, p1, p2, p3, t / smoothing)
        result.push(pt)

        if (result.length > 1) {
          this.totalLength += this._calculateDistance(result[result.length - 2], pt)
        }
      }
    }

    result.push(points[points.length - 1])

    return result
  }

  _calculateDistance(p1, p2) {
    return Math.sqrt(p1.reduce((acc, _, i) => acc + Math.pow(p2[i] - p1[i], 2), 0))
  }

  _refreshDynamicProps() {
    super._refreshDynamicProps()
    this.path = this._generatePath()

    if (!this.target || this.path.length === 0) {
      this._setTargetProperties = Core._noop

    } else {
      this._tryToSetupProperties()
      this._preparePropertySetters()

    }
  }

  _tryToSetupProperties() {
    if (this.settings.properties) {
      this.properties = this.settings.properties

    } else if (this.path[0].length <= 3) {

      const propertiesLists = [
        ['position.x'],
        ['position.x', 'position.y'],
        ['position.x', 'position.y', 'position.z'],
      ]

      this.properties = propertiesLists[this.path[0].length - 1]

    } else {
      this.properties = []

    }
  }

  _setTargetProperties(values) {
    for (let i = 0; i < this.propertySetters.length; i++) {
      this.propertySetters[i](values[i])
    }
  }

  _clamp(value, min, max) {
    return Math.max(min, Math.min(value, max))
  }

  _getInterpolatedPosition() {
    const maxIndex = this.path.length - 1
    const exactIndex = this.easeValue * maxIndex
    const clampedExactIndex = this._clamp(exactIndex, 0, maxIndex)

    // Determine the indices of the two neighboring points
    const lowerIndex = clampedExactIndex >= maxIndex ? maxIndex - 1 : Math.floor(clampedExactIndex)
    const upperIndex = Math.min(lowerIndex + 1, maxIndex)

    const interpolationFactor = exactIndex - lowerIndex

    const lowerPoint = this.path[lowerIndex]
    const upperPoint = this.path[upperIndex]

    return lowerPoint.map((coord, i) =>
      Core.lerp(coord, upperPoint[i], interpolationFactor)
    )
  }

  _update() {
    super._update()
    this._setTargetProperties(this._getInterpolatedPosition())
  }
}