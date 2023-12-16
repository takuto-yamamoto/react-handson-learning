// データのfetch(promise chain)
fetch(`https://api.github.com/users/moonhighway`)
  .then((response) => response.json())
  .then(console.log)
  .catch(console.error);

// データのfetch(async/await)
const requestGithubUser = async (githubLoginId) => {
  try {
    const response = await fetch(`https://api.github.com/users/moonhighway`);
    const userData = await response.json();
    console.log(userData);
  } catch (e) {
    console.error(e);
  }
};

// シンプルなPOST
fetch('create/user', {
  method: 'POST',
  body: JSON.stringify({ username, password, bio }),
});

// ファイルアップロード
// ファイルアップロード時はmultipart/form-dataを使用する
const formData = new FormData(); // multipart/form-dataを取り扱う
formData.append('userName', 'tarte');
formData.append('fullName', 'tarte');
formData.append('avatar', imgFile);
fetch('create/user', { method: 'POST', body: formData });

// APIは大抵認証を求められる（Authorizationヘッダ）
fetch(`https://api.github.com/users/${login}`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// githubのユーザー情報を格納するコンポーネント例
const GithubUser = ({ login }) => {
  const [data, setData] = useState();

  useEffect(() => {
    if (!login) return;
    fetch(`https://api.github.com/users/${login}`)
      .then((response) => response.json())
      .then(setData)
      .catch(console.error);
  }, [login]);

  if (data) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }

  return null;
};

// ローカルストレージへのJSONオブジェクト読み込み、書き込み（同期関数なので乱発するとパフォーマンス低下の可能性あり）
const loadJSON = (key) => key && JSON.parse(localStorage.getItem(key));
const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ローカルストレージにキャッシュするコンポーネント
const GithubUserWithLocalStorage = ({ login }) => {
  const [data, setData] = useState(loadJSON(`user:${login}`));

  useEffect(() => {
    if (!data) return;
    if (data.login === login) return;

    const { name, avatar_url, location } = data;
    saveJSON(`user:${login}`, {
      name,
      login,
      avatar_url,
      location,
    });
  }, [data]);

  useEffect(() => {
    if (!login) return;
    fetch(`https://api.github.com/users/${login}`)
      .then((response) => response.json())
      .then(setData)
      .catch(console.error);
  }, [login]);

  if (data) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }

  return null;
};

// LocalStorage, SessionStorage, HTTP Cacheの使い分けがダイジ
// HTTPキャッシュがマッチするのであれば、LocalStorageを使用するべきではない

// コンポーネントは3つの状態(success, loading, error)にUIレベルで対応すべき
function GitHubUserConsideringFetchStatus({ login }) {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!login) return;
    setLoading(true);
    fetch(`https://api.github.com/users/${login}`)
      .then((data) => data.json())
      .then(setData)
      .then(() => setLoading(false))
      .catch(setError);
  }, [login]);
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
  if (loading) return <h1>loading...</h1>;
  if (!data) return null;
  return (
    <div className="githubUser">
      <img src={data.avatar_url} alt={data.login} style={{ width: 200 }} />
      <div>
        <h1>{data.login}</h1>
        {data.name && <p>{data.name}</p>}
        {data.location && <p>{data.location}</p>}
      </div>
    </div>
  );
}

// レンダープロップ＝描画のためのprops
const tahoe_peaks = [
  { name: 'Free Peak', elevation: 10891 },
  { name: 'Monument Peak', elevation: 10067 },
  { name: 'Pyramid Peak', elevation: 9983 },
  { name: 'Mt. Talc', elevation: 9735 },
];

const App = () => {
  return (
    <ul>
      {tahoe_peaks.map((peak, i) => {
        <li key={i}>
          {peak.name} - {peak.elevation.toLocaleString()}ft
        </li>;
      })}
    </ul>
  );
};

// with renderProps
// 再利用可能なリストコンポーネント
const ListRenderProp = ({ data = [], renderEmpty, renderItem }) => {
  if (!data.length) return renderEmpty;

  return (
    <ul>
      {data.map((item, i) => (
        <li key={i}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};

const AppRenderEmpty = () => {
  return (
    <List
      data={tahoe_peaks}
      renderEmpty={<p>This list is empty</p>}
      renderItem={(data) => {
        <>
          {item.name} - {item.elevation.toLocaleString()}ft
        </>;
      }}
    />
  );
};

// 仮想リスト
// 巨大なデータ配列があった場合、一度にそんなには画面上に表示できない
import faker from 'faker';
import { useEffect, useState } from 'react';

const bigList = [...Array(5000)].map(() => ({
  name: faker.name.findName(),
  email: faker.internat.email(),
  avatar: faker.internet.avatar(),
}));
// 5000個のdivを生成するごり押しパターン
const AppWithBigList = () => {
  const renderItem = ({ name, email, avatar }) => {
    <div style={{ display: 'flex' }}>
      <img src={avatar} alt={name} width={50} />
      <p>
        {name} - {email}
      </p>
    </div>;
  };

  return <List data={bigList} renderItem={renderItem} />;
};
// 仮想リスト
import { FixedSizedList } from 'react-window';

const AppWithWindowList = () => {
  const renderRow = ({ index, style }) => (
    <div style={{ ...style, display: 'flex' }}>
      <img src={bigList[index].avatar} alt={bigList[index].name} width={50} />
      <p>
        {bigList[index].name} - {bigList[index].email}
      </p>
    </div>
  );

  return (
    <FixedSizedList
      height={window.innerHeight}
      width={window.innerWidth}
      itemCount={bigList.length}
      itemSize={50}
    >
      {/**レンダープロップがプロパティではなく子要素として渡されるのはあるある */}
      {renderRow}{' '}
    </FixedSizedList>
  );
};

// useFetchフック
const useFetch = (uri) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uri) return;
    fetch(uri)
      .then((response) => response.json())
      .then(setData)
      .then(() => setLoading(false))
      .catch(setError);
  }, [uri]);

  return { loading, data, error };
};

const GithubUserWithFetchHook = ({ login }) => {
  const { loading, data, error } = useFetch(
    `https://api.github.com/users/${login}`
  );

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="githubUser">
      <img src={data.avatar_url} alt={data.login} style={{ width: 200 }} />
      <div>
        <h1>{data.login}</h1>
        {data.name && <p>{data.name}</p>}
        {data.location && <p>{data.location}</p>}
      </div>
    </div>
  );
};

const Fetch = ({
  uri,
  renderSuccess,
  loadingFallback = <h1>Loading...</h1>,
  renderError = (error) => <pre>{JSON.stringify(error, null, 2)}</pre>,
}) => {
  const { loading, data, error } = useFetch(uri);
  if (error) return renderError(error);
  if (loading) return loadingFallback;
  if (data) return renderSuccess(data);
};

const GithubUserWithFetchComponent = ({ login }) => {
  return (
    <Fetch
      uri={`https://api.github.com/users/${login}`}
      renderSuccess={UserDetails}
    />
  );
};
const UserDetails = ({ data }) => {
  return (
    <div className="githubUser">
      <img src={data.avatar_url} alt={data.login} style={{ width: 200 }} />
      <div>
        <h1>{data.login}</h1>
        {data.name && <p>{data.name}</p>}
        {data.location && <p>{data.location}</p>}
      </div>
    </div>
  );
};
