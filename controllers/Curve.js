import { Core } from "../core/Core"

export class Curve extends Core {
    static DEFAULTS = {
        ...Core.DEFAULTS,
        target: null,
        properties: [],
        points: [],
        smoothing: 20,
        // targets: [],
        // useLerp: true,
        // path: [],
        // speed: 1,
    };

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

        if (!this.settings.target || this.path.length === 0 || this.settings.properties.length === 0) {
            this._setTargetProperties = Core._noop
        }
    }

    _setTargetProperties(values) {
        this.settings.properties.forEach((property, index) => {
            const keys = property.split('.')
            let obj = this.settings.target

            for (let i = 0; i < keys.length - 1; i++) {
                obj = obj[keys[i]]
            }

            obj[keys[keys.length - 1]] = values[index]
        })
    }

    _clamp(value, min, max) {
        return Math.max(min, Math.min(value, max))
    }

    _lerp(a, b, t) {
        return a + (b - a) * t
    }

    _getInterpolatedPosition() {
        // Вычисляем точное положение между точками
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
            this._lerp(coord, upperPoint[i], interpolationFactor)
        )
    }

    _update() {
        super._update()
        this._setTargetProperties(this._getInterpolatedPosition())
    }
}