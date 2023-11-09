## メモ

- fetch の送信

  - `JSON.stringify` でオブジェクトを文字列化する
  - ファイルアップロード時は multipart/form-data
    - FormData オブジェクトにデータを append する必要がある
  - 認証情報などは headers に追加される
    - Authorization: 認証トークンヘッダ

- データの保存
  - localStrage
    - 同一オリジンであれば異なるページやタブから閲覧可能
    - ブラウザのキャッシュ/データがクリアされるまで永続
  - sessionStrage:
    - ページ遷移では継続、別タブや別ウィンドウでは新しいセッション
    - タブが閉じるとデータはクリアされる
  - JSON API
    - parse/stringify と strageAPI の getItem/setItem
      - 同期処理なのでパフォーマンス低下の要因となりうる
  - localStrage のキャッシュしどころ
    - アプリケーションの複雑性が増すので、使い所に注意
    - HTTP キャッシュが確実には使用できない場合などに使用
    - `Cache-Contral: max-age=<有効時間>`ヘッダをレスポンスヘッダにつければ OK
