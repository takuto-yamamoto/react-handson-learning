## メモ

- 実際の開発では createElement は使用されず JSX シンタックスシュガーを使用する
- HTML との違い
  - JSX は HTML と異なりコンポーネントも使用可能（ネスト可能）
  - class が JS の予約語であるため、HTML の class 属性は JSX だと className 属性
  - 変数や式を代入したい場合は`{}`で囲む必要がある
- JSX は Babel などのトランスパイラーを使用してバニラ JS に変換される
  - HTML の script タグ内に`type='text/babel'`を記載することでトランスパイル可能だが、オーバーヘッドが大きいので商用環境では非推奨
  - prod 環境では事前コンパイル推奨
- 関数の返り値は 1 つのトップレベル React コンポーネントなので、2 つ以上のコンポーネントを返すことはできない
  - React.Flaggment（<></>）の出番
- webpack を使ってビルド環境を構築する
  - React を prod 環境で採用するための障壁: JSX 変換(Babel), コンポーネント依存関係の管理, 画像や CSS の最適化...etc.
  - これらを包括的に解決してくれる webpack が成功を収めている
  - webpack=モジュールバンドラー
    - 異なる形式のファイルや依存関係を単一のモジュールに結合するためのツール
    - ネットワーク負荷の削減
    - コードの分割とミニフィケーション(最適化)
    - 機能フラグ: 環境に応じて特定の部分をオンオフできる機能
    - Hot Module Replacement: ソースコードの変更を監視してリアルタイムにブラウザに反映する機能
    - webpack や babel がブラウザごとの差分を吸収してくれる(ES.next とかも使用可能)
- JSX を使用するには React ライブラリの import が必要(React.createElement にトランスパイルされるため)
- webpack ビルド環境の構築
  - `npm install --save-dev webpack webpack-cli`
  - ` webpack.config.js`で webpack の設定を実施可能
- babel ビルド環境の構築
  - `npm install babel-loader @babel/core --save-dev`
  - プリセット環境の呼び出し
    - `npm install @babel/preset-env @babel/preset-react --save-dev`
    - .babelrc の presets 項目を設定
- webpack のビルド
  - babel の設定を済ませ scripts に`npx webpack --mode development|production` を記載し`npm run build`
  - バンドルが/dist/assets に出力されるので、/dist 配下に indexx.html を置いて script タグおよび div(id="root")を指定する
  - "sourve-map"を webpack.config.js の devtool 属性に追加することで、バンドルされたファイルと元のモジュールの対応関係が保持されデバッグが可能になる
- 上記の作業をいい感じにやってくれるのが create-react-app
  - react, react-dom, react-scripts を内包
    - react-scripts: 設定ずみの eslint, babel, webpack などツールを含む