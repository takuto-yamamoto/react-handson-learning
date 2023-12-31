## メモ

- 概要

  - プロパティは Read-Only のデータ、ステートはレンダリング後も更新されるデータ
  - ステートを導入することで既存の UI を変更削除したり、新しいレシピを追加する UI を提供可能
  - **state と props の相互作用を適切にデザインすることが React の鍵**
    - あるコンポーネントの state の変更が他のコンポーネントの props に伝播し、それがツリー全体に波及し、最終的に必要な部分が変更レンダリングされる...
  - state によりよりインタラクティブなアプリケーションを実装する

- StarRating コンポーネント

  - styles は基本的にプロパティに追加する
  - ...props をプロパティに入れる場合はいかに注意
    - props をパスするコンポーネントに必要な props しか受け取れない
    - props に不正なプロパティが含まれるリスク
    - ゆえに props 残余引数は自身のコンポーネントに対してどのようなプロパティが設定されるかが予見できる場合にのみ有効

- アプリケーション全体のステート管理

  - 複数のコンポーネントがステートを持つのはあまりよくないので集中的に管理したほうが効率的
  - パターン: 最上位のルートコンポーネントで全てのステートを管理して、子コンポーネントに props として渡す（色々問題ありそう）
    - ユーザーの操作をコンポーネントツリーの下から上に伝える
      - イベントハンドラの実装を最上位のコンポーネントに渡す
      - 子供のコンポーネントはハンドラを中継するのみ
    - ハンドラを受け取って子供に引き渡すだけなので純粋関数が維持され再利用性が高まる
    - 最上位コンポーネントの state の変更が props としてツリー全体に波及する

- フォーム入力を処理するアプリケーション

  - ref: DOM ノードに直接アクセスするユースケース
    - ref に useRef した変数を渡すことで DOM 参照をバインドできる
    - イベントハンドラに ref の取得と更新処理を入れれば非同期 state みたいな感じで使用可能
    - 基本的に命令的な書き方になるので避ける
      - React 以外のライブラリとやり取りするなどの特別な場合のみ使用する
    - tips: form のデフォルト動作は url 属性への POST リクエスト発出なのでみんな preventDefault している
  - 制御されたコンポーネントとして処理
    - React に命令的な処理を任せられるので宣言的に実装可能
    - 不要な再レンダリングは React に防止されるものの、重い処理などは関数コンポーネント内に書くべきではない

- カスタムフック

  - 制御されたコンポーネント内において、重複されたコード/処理は関数に切り出して抽象化すべき
  - props が抽象化可能なロジックを持っている場合などはカスタムフックで抽象化して呼び出す

- コンテキスト

  - state の一括管理の限界(スケールしない)を打開するための中央管理策
  - 複数のコンテキストを作成し、一部のコンポーネントにそれぞれ適用させることが可能
    - Context.Provider: 登録
    - Context.Consumer: 呼び出し(useContext 経由)

- コンテキストとステートの併用

  - コンテキストは情報の公開のみ、コンテキストを設定するコンポーネント内で設定値をステートとして管理することで、プロバイダー配下のコンポーネントにステートの変更が波及する
  - ステートを保持するコンテキスト提供コンポーネント=カスタムプロバイダー
    - レベル 1: ステートとその操作関数を配下に公開する
    - レベル 2: ステートと定義済み操作関数を公開する(配下から特定の操作しかできないようにする)
    - レベル 3: ステートと dispatch 関数を公開する(useReducer)

- コンテキストとカスタムフックの併用
  - コンテキストをコンシューマに公開することなく使用可能
  - コンテキスト操作すらもフックに隠蔽可能
  - アプリケーションのロジックをフックに分離して宣言的な UI の開発に専念可能
  - UI とロジックを別々に開発し、テストし、デプロイする
