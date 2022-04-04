# CodeColor

## Methods

### highlight

Highlight source code, return string with html structure

```typescript
highlight(code: string, language: ILanguageName): string
```

#### Parameters

| Name       | Type            | Description   |
| :--------- | :-------------- | :------------ |
| `code`     | _string_        | source code   |
| `language` | _ILanguageName_ | language name |

### register

Register language syntax

#### Parameters

| Name       | Type        | Description                                                                                                      |
| :--------- | :---------- | :--------------------------------------------------------------------------------------------------------------- |
| `syntaxes` | _ISyntax[]_ | Array of language syntax structure. Available languages can be imported from `codecolor.js/languages/[LANGUAGE]` |
