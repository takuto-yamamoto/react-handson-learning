# メモ

- React コンポーネントのテスト

  - jest と jsdom で DOM をシミュレート可能なので、Node.js 上でテストが可能
  - DOM シミュレータにコンポーネントをレンダリングし、比較する

- イベントのテスト

  - fireEvent で実装

- コードカバレッジ
  - `--coverage` フラグを付けて npm test を実行
  - 通常は 85%ほどを目指せば OK
