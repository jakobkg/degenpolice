declare module 'is-furry' {
  type isFurryOptions = {
    fold?: boolean,
    foldMode?: 'keep' | 'replace',
    foldReplacement?: string,
    outputMode: 'boolean' | 'number' | 'string' | 'array',
    outputReplacement?: string,
    strictness?: 0 | 1 | 2,
    checkWordBoundaries?: boolean
  }

  type isFurryBoolReturn = {
    fold?: boolean,
    foldMode?: 'keep' | 'replace',
    foldReplacement?: string,
    outputMode: 'boolean',
    outputReplacement?: string,
    strictness?: 0 | 1 | 2,
    checkWordBoundaries?: boolean
  }

  type isFurryNumReturn = {
    fold?: boolean,
    foldMode?: 'keep' | 'replace',
    foldReplacement?: string,
    outputMode: 'number',
    outputReplacement?: string,
    strictness?: 0 | 1 | 2,
    checkWordBoundaries?: boolean
  }

  type isFurryStringReturn = {
    fold?: boolean,
    foldMode?: 'keep' | 'replace',
    foldReplacement?: string,
    outputMode: 'string',
    outputReplacement?: string,
    strictness?: 0 | 1 | 2,
    checkWordBoundaries?: boolean
  }

  type isFurryArrayReturn = {
    fold?: boolean,
    foldMode?: 'keep' | 'replace',
    foldReplacement?: string,
    outputMode: 'array',
    outputReplacement?: string,
    strictness?: 0 | 1 | 2,
    checkWordBoundaries?: boolean
  }

  type isFurryReturnType<T extends isFurryOptions> = T extends isFurryBoolReturn
    ? boolean
    : T extends isFurryNumReturn
    ? number
    : T extends isFurryStringReturn
    ? string
    : string[];


  export default function(string: string, options?: T): isFurryReturnType;
}