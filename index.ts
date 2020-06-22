type Tagged = {_tag: string}

type Tags<TUnionType extends Tagged> = TUnionType['_tag']

type TagTypeMap<TUnionType extends Tagged, TTags=Tags<TUnionType>> = {
  // @ts-ignore
  [TTag in TTags]: TUnionType extends {_tag: TTag} ? TUnionType : never
}

type Patt<TResult, TagTypeMap> = {
  [K in keyof TagTypeMap]: (item: TagTypeMap[K]) => TResult
}

type Pattern<TResult, TUnionType extends Tagged> =
  Patt<TResult, TagTypeMap<TUnionType>>

const match = <TResult, TUnionType extends Tagged>
  (pattern: Pattern<TResult, TUnionType>) =>
    (object: TUnionType) =>
      pattern[object._tag](object) as TResult

// ------------------Sample------------------
type Square = {len: number, _tag: 'Square'}
type Circle = {rad: number, _tag: 'Circle'}
type Rectangle = {xlen: number, ylen: number, _tag: 'Rectangle'}

type Shape = Square | Circle | Rectangle

const shapeDescription: Pattern<string, Shape> = {
  Square: ({len}) => `I am square with length ${len}`,
  Circle: ({rad}) => `I am circle with radius ${rad}`,
  Rectangle: ({xlen, ylen}) => `I am rectangle with sides ${xlen} and ${ylen}`
}

const shapes = [
  {len: 1, _tag: 'Square'},
  {rad: 2, _tag: 'Circle'},
  {xlen: 3, ylen: 4, _tag: 'Rectangle'}
]

const matcher = match(shapeDescription)

const descriptions = shapes.map(matcher)

descriptions.forEach(d => console.log(`Description ${d} END`))

// Example of dynamic type evaluation by tag
type Dynamic<Type extends Shape['_tag']> = Extract<Shape, {_tag: Type}>
// evaluates to {rad: number, type: "Circle"}
type Circle2 = Dynamic<'Circle'>