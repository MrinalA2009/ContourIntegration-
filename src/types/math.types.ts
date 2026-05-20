/** A complex number z = re + im·i */
export interface Complex {
  re: number
  im: number
}

/** Parametric complex-valued function of t ∈ [0, 1] */
export type ComplexFn = (t: number) => Complex

/** Complex-to-complex transformation */
export type ComplexTransform = (z: Complex) => Complex

/** A contour path defined parametrically */
export interface ContourPath {
  /** Parametric function mapping t ∈ [0,1] to points on the contour */
  fn: ComplexFn
  /** Number of sample points for rendering. Default 200 */
  resolution?: number
  /** Whether the contour is closed (return to start). Default false */
  closed?: boolean
  /** Label for the contour (e.g., "γ", "C") */
  label?: string
}

/** The visible window in the complex plane */
export interface DomainConfig {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

/** One step in a sequential equation derivation */
export interface EquationStep {
  /** LaTeX string for this step */
  latex: string
  /** Optional human-readable annotation */
  label?: string
  /** KaTeX class names of terms to highlight in this step */
  highlight?: string[]
  /** Delay before this step appears (ms) */
  delay?: number
}

/** A mathematical statement block (theorem, lemma, definition, etc.) */
export interface TheoremData {
  type: 'theorem' | 'lemma' | 'corollary' | 'definition' | 'proposition' | 'remark'
  title: string
  number?: string
  statement: string
  /** LaTeX for the formal statement */
  latex?: string
}

/** Configuration for an animated arrow/vector */
export interface VectorConfig {
  /** Start point in complex coordinates */
  origin: Complex
  /** End point (or direction vector) in complex coordinates */
  terminus: Complex
  label?: string
  color?: string
  /** Arrow head size in SVG units */
  headSize?: number
}

/** Grid configuration for vector fields */
export interface VectorFieldConfig {
  /** Complex transform that defines the vector at each point */
  fn: ComplexTransform
  domain: DomainConfig
  /** Number of sample points per axis */
  gridDensity?: number
  /** Maximum arrow length in SVG units */
  maxLength?: number
  colorMode?: 'magnitude' | 'argument' | 'uniform'
}

export interface SVGPoint {
  x: number
  y: number
}

export interface ComplexPlaneContextValue {
  domain: DomainConfig
  svgWidth: number
  svgHeight: number
  /** Convert complex coordinates to SVG pixel coordinates */
  toSVG: (z: Complex) => SVGPoint
  /** Convert SVG pixel coordinates back to complex coordinates */
  fromSVG: (p: SVGPoint) => Complex
}
