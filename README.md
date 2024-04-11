# Check Your CSS

<p align="center">
<img src="./resources/cyc-logo.png" alt="cyc logo">
</p>

<p align="center">
사용자의 프로젝트에서 모든 CSS를 가져와 호환성을 체크하는 도구입니다.
</p>

# 🔗 Links

<p align="center">
  <a href="#">Deployed website</a>
  <span> | </span>
  <a href="https://github.com/TeamTitans1/checkyourcss-npm">npm Repository</a>
  <span> | </span>
  <a href="https://github.com/TeamTitans1/checkyourcss-vscode">VS code Extension Repository</a>
</p>

# 📌 Table of Contents

- [기술 스택]()
- [npm 시연]()
- [vscode 시연]()
- [프로젝트 소개 - 왜 CSS 호환성이 중요할까??]()
  - [CSS 호환성 체크를 왜 3가지 방법으로 .?!]()
- [겪었던 문제들]()
  - [Utility-first CSS에서 사용된 CSS만 가져오기]()
  - [빌드된 Utility-first-CSS와 Styled-components에서 정확히 CSS속성만 추출할 수 있을까?]()
    - [AST란?]()
  - [처음 만들어보는 npm package]()
  - [처음 만들어보는 vscode extension]()

# 🛠 Tech Stacks

![Electron](https://img.shields.io/badge/electron-%2320232a.svg?style=for-the-badge&logo=electron&logoColor=%47848F)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

# 🎬시연

- npm package
  <img src="./resources/npm-video.gif">

- VSCode extension
  <img src="./resources/vscode-video.gif">

# 📌 Introduction

## ❓ Why CSS Compatibility?

- CSS 호환성은 웹 개발의 필수 요소로, 모든 사용자에게 일관된 경험을 제공하는 데 핵심적인 역할을 합니다. 이는 웹 페이지가 다양한 브라우저와 장치에서도 예상대로 작동하고 표시되게 하는 것을 목표로 합니다. 이해의 편의를 위해, 왜 CSS 호환성이 중요한지 그리고 이에 대한 심층적인 이해를 돕기 위해 몇 가지 주요 포인트를 자세히 살펴보겠습니다.

#### 🌐 다양한 웹 브라우저에서의 일관성

- 웹 개발자로서 가장 큰 도전 중 하나는 다양한 웹 브라우저에서 일관된 사용자 경험을 제공하는 것입니다. 각 브라우저는 자체적인 렌더링 엔진을 가지고 있으며, 이는 동일한 CSS 코드가 브라우저마다 다르게 해석될 수 있음을 의미합니다. 예를 들어, Firefox에서 잘 작동하는 CSS 스타일이 Internet Explorer에서는 원하는 대로 표시되지 않을 수 있습니다. 이는 브라우저마다 다른 CSS 속성과 기능의 구현 및 지원 수준 때문입니다. 따라서, 개발자는 크로스 브라우징 호환성을 고려하여 모든 사용자에게 안정적인 경험을 제공해야 합니다.

#### 📱 다양한 장치와 화면 크기에 대한 대응

- 현대의 웹 사용자는 다양한 장치를 사용하여 웹에 접근합니다. 스마트폰, 태블릿, 데스크톱, 심지어 스마트워치와 같은 다양한 장치에서 웹 사이트가 잘 작동해야 합니다. 이는 개발자가 다양한 화면 크기, 해상도, 입력 방식 등을 고려해야 함을 의미합니다. 반응형 웹 디자인은 이러한 다양성을 지원하기 위해 필수적이며, CSS는 이 과정에서 중심적인 역할을 합니다.

#### 🔄 브라우저의 지속적인 업데이트

- 브라우저는 지속적으로 업데이트되며, 각 업데이트는 새로운 기능이 추가되거나 기존 기능이 변경될 수 있습니다. 이러한 변화는 웹 개발자에게 지속적인 학습과 적응을 요구합니다. 또한, 웹 사이트나 애플리케이션이 최신 표준을 따르면서도 가능한 한 많은 브라우저와 장치에서 작동할 수 있도록 유지보수하는 것이 중요합니다.

#### 🚀 프로젝트의 중요성

- 이러한 이유로, CSS 호환성에 중점을 둔 프로젝트를 진행하는 것은 매우 중요합니다. 이 프로젝트의 목적은 웹 개발자들이 다양한 브라우저와 장치에서 일관된 경험을 제공할 수 있도록 지원하는 것입니다. 이를 통해 개발자는 CSS 코드가 예상대로 작동하고, 사용자에게 최적화된 경험을 제공할 수 있는지 검증할 수 있습니다. 결과적으로, 이 프로젝트는 웹의 접근성과 사용성을 향상시키는 데 기여하며, 더 넓은 사용자 베이스에 웹 콘텐츠를 제공할 수 있는 기회를 열어줍니다.

- CSS 호환성은 단순히 기술적인 문제를 넘어서 사용자 경험과 직결되는 요소입니다. 모든 사용자가 어떤 환경에서든 최상의 경험을 할 수 있도록 보장하는 것은 웹 개발의 핵심 철학 중 하나이며, 이는 웹을 더 포괄적이고 접근 가능한 공간으로 만드는 데 기여합니다.

## ⚙️ Three Different Platforms

- 사용자와 개발자 모두에게 친숙하면서도 다양한 환경에서 효과적으로 사용될 수 있도록 설계하기 위해 3가지 플랫폼으로 만들었습니다. 이러한 접근 방식은 기술의 접근성을 높이고, 사용자와 개발자의 경험을 향상시키며, 다양한 환경에서의 호환성을 강조하고자 하였습니다.

1. Electron을 이용한 데스크탑 앱

- Electron 기반의 데스크탑 앱은 플랫폼 간 호환성이 높습니다. Windows, MacOS, Linux 등 다양한 운영체제에서 실행되기 때문에, 사용자가 어떤 OS를 사용하든지 간에 동일한 사용자 경험을 제공할 수 있습니다. 이는 개발자에게도 큰 이점을 제공합니다. 단일 코드베이스를 유지하면서 여러 플랫폼에 앱을 배포할 수 있기 때문에, 개발 및 유지보수 과정이 효율적으로 이루어집니다. 또한, Electron 앱은 직관적인 사용자 인터페이스를 제공하여, 사용자가 추가적인 교육 없이도 앱을 쉽게 사용할 수 있도록 합니다. 이는 사용자의 만족도를 높이고, 앱의 접근성을 향상시키는 중요한 요소입니다.

2. VS Code Extension

- Visual Studio Code는 현대 개발자에게 필수적인 도구 중 하나로 자리 잡았습니다. 이 환경에서 작동하는 확장 프로그램을 개발함으로써, 개발자는 익숙한 환경에서 직접 호환성 정보를 확인하고 문제를 해결할 수 있습니다. 이는 개발 과정을 간소화하고 효율성을 증대시킵니다. 실시간으로 호환성 정보를 제공하는 기능은 개발자가 코드를 작성하는 동안 즉각적인 피드백을 받을 수 있게 하여, 잠재적인 문제를 빠르게 식별하고 수정할 수 있게 합니다. 또한, 호환되지 않는 CSS를 시각적으로 강조함으로써, 개발자는 더 빠르고 효과적으로 문제를 진단하고 해결할 수 있습니다.

3. npm package

- npm은 JavaScript 개발자에게 필수적인 도구이며, npm 패키지를 통해 제공되는 이 플랫폼은 높은 접근성과 범용성을 자랑합니다. 개발자는 자신의 프로젝트에 필요한 패키지를 쉽게 찾아 설치할 수 있으며, 이는 개발 과정을 대폭 간소화합니다. 패키지의 재사용성과 공유 용이성은 오픈 소스 커뮤니티에서의 협력을 촉진하고, 다양한 프로젝트에서의 빠른 통합을 가능하게 합니다. 이러한 접근 방식은 개발 속도를 높이는 동시에, 다양한 프로젝트와 환경에서의 효과적인 사용을 보장합니다.

- 이 세 가지 플랫폼 접근 방식은 사용자와 개발자가 기술에 보다 쉽게 접근하고, 효율적으로 사용할 수 있도록 설계되었습니다. 각 플랫폼은 특정 사용 사례와 환경에 맞게 최적화되어 있으며, 이는 기술의 유연성과 범용성을 높이는 핵심 요소입니다.

# 📌 Challenges

## 🔥 Utility-first CSS에서 사용된 CSS만 가져오기

- Utility-first CSS, 특히 TailwindCSS 같은 프레임워크의 적용은 웹 개발의 효율성과 유지보수성을 대폭 향상시킵니다. 이러한 접근 방식은 디자인과 개발의 간격을 좁히고, 빠르고 일관된 스타일링을 가능하게 합니다. 그러나 이 방식을 적용하며 개발자가 직면할 수 있는 도전 중 하나는 프로젝트에서 실제로 사용된 CSS 속성만을 추출하는 것입니다.

📈 TailwindCSS와 Utility-first 접근법의 이해

- Utility-first CSS는 반복적인 stylesheet 대신, HTML에 클래스를 직접 적용하여 스타일을 지정합니다. TailwindCSS와 같은 프레임워크는 수많은 유틸리티 클래스를 제공하여, 개발자가 복잡한 CSS 파일을 작성하지 않고도 다양한 디자인을 구현할 수 있게 합니다. 이는 개발 속도를 높이고, 디자인의 일관성을 유지할 수 있도록 돕습니다.

🔄 초기 접근 방식과 한계

- 초기에는 JSX 요소를 직접 탐색하여 클래스를 추출하고, 이를 [Tailwind to CSS](https://github.com/Devzstudio/tailwind_to_css/)와 같은 웹사이트를 통해 표준 CSS 속성으로 변환하는 방법을 사용했습니다. 이 접근법은 직관적이고 직접적이지만, 프로젝트의 규모가 커짐에 따라 다루어야 하는 데이터의 양이 증가하고, 예외 상황이나 복잡한 케이스를 처리하는 데 있어 한계를 드러냈습니다.

🚀 개선된 접근 방식: 빌드 과정 활용

- TailwindCSS를 사용한 프로젝트를 빌드할 때, 모든 사용된 Tailwind 클래스가 포함된 하나의 최종 CSS 파일이 생성된다는 점에 주목했습니다. 이 파일은 프로젝트에 실제로 사용된 모든 스타일 정보를 담고 있으므로, 이를 활용하는 것이 효율적인 솔루션이 될 수 있습니다.

```css
/* 빌드 폴더에 있는 CSS 파일 예시 */
.text-center {
  text-align: center;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}
```

🛠️ 구현 방식

- Node.js의 `os` 모듈에서 제공하는 `tmpdirectory()` 메서드를 사용하여 임시 디렉토리의 경로를 얻습니다. 이 임시 디렉토리는 운영체제에 상관없이 접근 가능하며, 주기적으로 삭제되므로 사용자의 주요 프로젝트 파일에 영향을 주지 않습니다. 프로젝트를 이 임시 디렉토리에서 빌드하면, TailwindCSS 프레임워크는 사용된 모든 클래스를 포함하는 CSS 파일을 생성합니다. 이렇게 생성된 CSS 파일을 분석함으로써, 실제로 사용된 스타일만을 추출하고, 불필요한 코드를 제거하여 최적화할 수 있습니다.

## 🔥 빌드된 Utility-first-CSS와 Styled-components에서 정확히 CSS속성만 추출할 수 있을까?

### ❓ AST란

- AST _(Abstract Syntax Tree, 추상 구문 트리)_ 는 소스 코드의 구조를 나무 형태로 표현한 것으로, 코드의 구문적 구조를 분석할 때 사용되며 프로그래밍 언어의 구문을 분석하고 처리하는 데에 널리 사용됩니다.

- AST로 파싱되는 과정

1. 어휘 분석(Lexical Analysis)

**어휘 분석**의 목적은 소스 코드를 읽고, 이를 토큰(Token)이라는 의미 있는 단위로 분해하는 것입니다. 여기서 토큰이란 변수 이름, 연산자, 숫자, 괄호 등 코드의 기본 요소를 나타냅니다.

어휘 분석을 하며 소스코드를 읽을 때 코드를 문자 단위 하나하나 스캔하며 공백, 연산자 기호 또는 특수 기호를 발견하면 단어가 완성되었다고 판별하게 됩니다. 단어가 완성되었다고 판별되면 단어를 분석하고 분석한 단어가 변수명인지, 연산자인지, 숫자 리터럴 등등으로 판별하고 토큰의 타입을 결정합니다.

2. 구문 분석(Syntactic Analysis)

구문 분석의 목적은 어휘 분석을 통해 얻은 토큰들 분석하여, 이들의 관계를 이해하고 AST를 생성하는 것입니다. 이 단계에서는 코드의 구조적 의미를 파악하고, 토큰들 사이의 문법적 관계를 파악하여, 프로그램의 구조적 의미를 나타내는 트리를 만듭니다.

- ex) const sum = 5 + 3;

먼저 어휘분석을 하게 되어 코드들을 토큰으로 나누게 됩니다. 이 예시의 경우에선 const, sum, =, 1, + ,2, ;이 토큰이 됩니다.

다음으로 구문분석을 하게 되면 위에서 생성된 토큰들을 기반으로 AST를 생성하게 됩니다.

가장 최상위 노드는 변수를 선언하는 const이며 아래로 sum이라는 변수가 있고 그 아래로 연산자를 의미하는 + 와 왼쪽에는 5, 오른쪽에는 3이 있다는 이러한 구조의 AST가 생성되게 됩니다.

조금 더 자세히 보면

```
function consolelog() {
  console.log("hi");
}
```

이 코드를 AST로 변환해 보면

```
{
  "type": "Program",
  "start": 0,
  "end": 36,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 36,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 10,
        "name": "a"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 13,
        "end": 36,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 17,
            "end": 34,
            "expression": {
              "type": "CallExpression",
              "start": 17,
              "end": 33,
              "callee": {
                "type": "MemberExpression",
                "start": 17,
                "end": 28,
                "object": {
                  "type": "Identifier",
                  "start": 17,
                  "end": 24,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 25,
                  "end": 28,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 29,
                  "end": 32,
                  "value": "a",
                  "raw": "\"a\""
                }
              ],
              "optional": false
            }
          }
        ]
      }
    }
  ],
  "sourceType": "module"
}
```

이러한 형태로 모드 의미를 갖는 토큰들로 구분됨을 알 수 있습니다.

이러한 방식과 마찬가지로 css파일이나 styled-component가 사용된 파일에서 코드를 파싱해서 생성된 AST를 순회하여 구조를 분석하고 단어의 의미를 파악하여 CSS속성을 찾는 방식으로 프로젝트를 진행하였습니다.

## ❗️실시간으로 CSS의 호환성을 확인해보자

electron을 사용해서 만든 데스크탑 앱은 진행중인 프로젝트를 중단하고 데스크탑 어플에 넣어 확인 하는 방식이였습니다. 그러던 중 개발자들이 원하는 방식은 무엇일까 고민하던 중 우리가 항상 사용하는 프리티어가 생각났습니다. 그렇게 추가로 npm package와 VScode extension을 만들면 좋겠다고 생각 했습니다,

- ### npm package 만들기
  저희가 만드는 check your css를 사용하는 대상은 개발자임을 항상 염두에 두고 프로젝트를 진행하였습니다. 개발자들은 보통 어떻게 사용하는가, 어떻게 사용하면 조금 더 직관적으로 사용할 수 있을까.

따라서

1. 터미널에 npx cyc를 입력
2. 체크하고 싶은 브라우저와 브라우저별 버전을 선택
3. 확인
   이러한 방식을 생각하였으나 매번 확인이 번거롭고 추후 호환되지 않는 css들에 대한 처리가 부족하다고 생각이 되어

4. npx cyc --init 명령어를 통해 체크하고 싶은 브라우저와 브라우저별 버전을 선택후 config 파일을 자동 생성
5. 그후 npx cyc를 할 때 마다 해당 브라우저와 버전들에 대한 css 호환성을 체크
6. 변경을 원하면 config파일을 직접 조작하거나 npx cyc --init을 다시 터미널에 입력해서 수정
7. css 수정방법 제안 후 수정
   이 방식으로 변환하였습니다.

- ### VScode Extension 만들기
  npm package와 다르게 vscode를 사용시 조금 더 실시간으로 사용자에게 정보 전달이 가능하다는 장점을 활용하여 사용자가 파일을 저장할 때 마다 사용자가 설정한 브라우저의 CSS호환성을 확인하여 호환되지 않는 경우 표시해주는 방법을 고안하였습니다. npm package와 비슷한 방식으로 진행하되 config.js이 아닌 settings.json에 브라우저와 브라우저별 버전을 설정하고 설정을 바탕으로 저장 할 때마다 실시간으로 확인하고 호환되지 않는 경우 수정 제안을 하도록 하였습니다.

1. command + shift + p 클릭하여 check your css 선택
2. 확인하고 싶은 브라우저와 브라우저별 버전 선택
3. command + s로 파일 저장시 호환성 검사 후 호환되지 않는 css에는 빨간 줄로 표시
4. 호환되지 않는 css위에 마우스 호버시 정보 표시 및 수정 제안
