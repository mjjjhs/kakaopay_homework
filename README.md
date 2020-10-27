# kakaopay-homework
카카오페이 과제

# npm script
### start
* webpack-dev-server로 hot-loading 서버를 실행 (development mode)
### build
* webpack으로 public 폴더에 번들링 (production mode)

#과제 해결 전략
## 1. 설정
* ### webpack
    - entry
        + kakaopay_homework
    - devServer
        + port 8080
        + index.html
        + contentBase = 'public'
    - loader
        + babel-loader
        + style-loader
        + css-loader
        + sass-loader
        + source-map-loader
    - plugin
        + html-webpack-plugin
        + terser-webpack-plugin
        + mini-css-extract-plugin
        + pnp-webpack-plugin
        + clean-webpack-plugin
    - ...
* ### typescript
    - target
        + ES5
    - lib
        + ES2015
        + ES2017
        + DOM
        + ESNext
    - removeComments
    - ...
* ### babel
    - preset-env
        + target
            + chrome 55
            + ie 11
        + corejs
            + version 3
    - preset-typescript
    - plugin
        + plugin-proposal-optional-chaining
        + plugin-proposal-nullish-coalescing-operator
        + plugin-proposal-private-methods
        + proposal-class-properties
        + proposal-object-rest-spread
        + plugin-transform-async-to-generator
        + plugin-transform-runtime
## 2. APP 구조
* ### Container Component
    - Game
        + 게임 메인 화면 / 게임 플레이 화면 Layout
    - GameResult
        + 게임 결과 Layout
* ### Presentation Component
    - Header
        + 게임 화면에서 상단의 시간 / 점수 / 문제 단어
* ### ETC
    - enums
        + 상수 요소 모음
    - helpers
        + Util 요소 모음 
    - interfaces
        + 인터페이스 정의 모음
    - routes
        + 라우터 모듈
    - styles
        + 스타일 정의
## 3. 해결 전략
* ### Routing
    - onhashchange를 이용한 hash 컨트롤   
    - '/' or '/#' -> 게임 메인   
    - '/#start' -> 게임 진행
    - '/#result' -> 게임 결과
    - 게임화면 첫 진입시 hashchange 이벤트 리스너를 생성하여 hash 변화를 감지
    - 게임 결과 페이지 URL을 직접 입력하여 들어왔을 경우 게임 결과 이력이 없으면 접근 못하게 Guard
    - 게임 결과는 페이지 내에서 게임을 진행하여 게임 결과를 한번이라도 얻었을 경우 sessionStorage에 저장하여 체크
* ### 게임 화면
    - ES6의 proxy를 이용하여 get/set 기능을 위주(observable)로 구현
    - Game이라는 Namespace를 가진 싱글턴 패턴으로 개발
    - start 함수의 호출로부터 게임 메인 페이지를 시작 ('/', '/#' 또는 '/#start' 라우트로 접근시)
    - Fetch API를 이용하여 게임 문제 리스트를 Fetch하고 render
    - 시작 버튼을 클릭했을 경우 '/#start'로 hash 변경
    - 초기화 버튼을 클릭했을 경우 게임을 초기화하고 '/#'로 hash 변
    - 게임 문제 리스트를 관리
    - 현재 점수를 관리 (현재 점수는 총 문제 수 - 오답 문제 수)
    - 현재 문제의 index를 관리
    - 단어당 걸린 시간을 관리
    - interval 시작시 timestamp와 정답을 맞췄을 경우 맞춘 시간의 timestamp를 계산하여 Map 객체에 저장 (오답시 해당 정보는 제거)
    - 문제를 풀거나 시간이 종료 됐을 때 다음 문제를 세팅하고 마지막 문제까지 종료됐을 경우 게임 결과 URL로 이동
    - 문제를 풀었을 때 게임 시작부터 걸린 시간을 계산하여 저장
    - 문제를 풀지 못했을 경우 점수 삭감 후 다음 문제 세팅
    - 문제 오타를 냈을 경우 입력된 값을 초기화
    - 문제 입력창에 enter keydown 이벤트 리스터 등록
    - 게임 시작시 입력창에 항시 focus 유지
    - 게임이 종료됐을 경우 게임 결과를 sessionStorage에 저장
    - Header 컴포넌트에 필요한 props 개념의 파라미터를 전달
    - Header 컴포넌트
        + Header라는 Namespace를 가진 싱글턴 패턴으로 개발
        + start 함수의 호출로부터 render 및 시간 경과 interval이 동작한다. (interval 존재시 clear)
        + 부모 Game으로부터 전달받은 props(word, second, score)를 proxy를 이용하여 props 변화를 감지하여 render
        + 부모로부터 전달받은 시간을 기준으로 interval 관리
* ### 게임 결과
    - GameResult이라는 Namespace를 가진 싱글턴 패턴으로 개발
    - start 함수의 호출로부터 게임 결과 페이지를 시작 ('/#result')
    - 게임 결과를 현재 게임에서 한번이라 결과를 획득해야 접근 가능
    - sessionStorage에 저장되어 있는 데이터를 가지고 '단어당 평균 답변 시간'을 계산하여 노출
    - 문제 푼 정보로 점수를 노출
    - 다시 시작 버튼 클릭시 '/#start'로 hash 변경되고 게임을 다시 진행
## 4. 단위 테스트




