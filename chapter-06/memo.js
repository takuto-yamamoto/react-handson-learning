// アプリケーション全体のステート管理
// React初期
// ステート値をコンポーネントツリーの上から下に伝える(ステート管理を親コンポーネントで実施する
const App = () => {
  const [colors] = useState(colorData);
  return <ColorList colors={colors}></ColorList>;
};

// 以下の子コンポーネントはstateを持つ必要がなくなったため、純粋関数となる
const ColorList = ({ colors = [] }) => {
  if (!colors.length) return <div>No Colors Listed.</div>;
  return (
    <div>
      {colors.map((color) => (
        <Color key={color.id} {...color} />
      ))}
    </div>
  );
};
const Color = ({ title, color, rating }) => {
  return (
    <section>
      <h1>{title}</h1>
      <div style={{ height: 50, backgroundColor: color }} />
      <StarRating selectedStars={rating} />
    </section>
  );
};
const StarRating = ({ totalStars = 5, selectedStars = 0 }) => {
  return (
    <>
      {[...Array(totalStars)].map((i) => (
        <Star key={i} selected={selectedStars > i} />
      ))}
      <p>
        {selectedStars} of {totalStars} stars
      </p>
    </>
  );
};

// ユーザーの操作をコンポーネントの下から上に伝える
// Colorコンポーネントに削除ボタンを追加した場合
const ColorWithDeleteButton = ({
  id,
  title,
  color,
  rating,
  onRemove = (f) => f,
}) => {
  return (
    <section>
      <h1>{title}</h1>
      <button onClick={() => onRemove(id)}>
        <FaTrash />
      </button>
      <div style={{ height: 50, backgroundColor: color }} />
      <StarRating selectedStars={rating} />
    </section>
  );
};

const ColorListWithRemovalColor = ({
  colors = [],
  onRemoveColor = (f) => f,
}) => {
  if (!colors.length) return <div>No Colors Listed.</div>;
  return (
    <div>
      {colors.map((color) => (
        <Color key={color.id} {...color} onRemove={onRemoveColor} />
      ))}
    </div>
  );
};

const AppWithRemovalColor = () => {
  const [colors, setColors] = useState(colorData);
  return (
    <ColorList
      colors={colors}
      onRemoveColor={(id) => {
        const newColors = colors.filter((color) => color.id !== id);
        setColors(newColors);
      }}
    ></ColorList>
  );
};

// レーティング更新時の挙動を追加
const RatableStarRating = ({
  totalStars = 5,
  selectedStars = 0,
  onRate = (f) => f,
}) => {
  return (
    <>
      {[...Array(totalStars)].map((i) => (
        <Star
          key={i}
          selected={selectedStars > i}
          onSelect={() => onRate(i + 1)}
        />
      ))}
      <p>
        {selectedStars} of {totalStars} stars
      </p>
    </>
  );
};

const ColorWithRatableStar = ({
  id,
  title,
  color,
  rating,
  onRemove = (f) => f,
  onRate = (f) => f,
}) => {
  return (
    <section>
      <h1>{title}</h1>
      <button onClick={() => onRemove(id)}>
        <FaTrash />
      </button>
      <div style={{ height: 50, backgroundColor: color }} />
      <StarRating
        selectedStars={rating}
        onRate={(rating) => onRate(id, rating)}
      />
    </section>
  );
};

const ColorListWithRatableColor = ({
  colors = [],
  onRemoveColor = (f) => f,
  onRateColor = (f) => f,
}) => {
  if (!colors.length) return <div>No Colors Listed.</div>;
  return (
    <div>
      {colors.map((color) => (
        <Color
          key={color.id}
          {...color}
          onRemove={onRemoveColor}
          onRate={onRateColor}
        />
      ))}
    </div>
  );
};

const AppWithRatableColor = () => {
  const [colors, setColors] = useState(colorData);
  return (
    <ColorList
      colors={colors}
      onRemoveColor={(id) => {
        const newColors = colors.filter((color) => color.id !== id);
        setColors(newColors);
      }}
      onRateColor={(id, rating) => {
        const newColors = colors.map((color) =>
          color.id === id ? { ...color, rating } : color
        );
        setColors(newColors);
      }}
    ></ColorList>
  );
};

// 制御されたコンポーネント
// 色を追加するUI
const AddColorForm = ({ onNewColor = (f) => f }) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#000000');

  const submit = (e) => {
    // ...
  };

  return (
    <form onSubmit={submit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        type="text"
        placeholder="color title..."
        required
      />
      <input
        value={color}
        onChange={(event) => setColor(event.target.value)}
        type="color"
        required
      />
      <button>ADD</button>
    </form>
  );
};

const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  return [
    { value, onChange: (e) => setValue(e.target.value) },
    () => setValue(initialValue),
  ];
};

const AddColorFormWithInputHook = ({ onNewColor = (f) => f }) => {
  const [titleProps, resetTitle] = useInput('');
  const [colorProps, resetColor] = useInput('#000000');

  const submit = (e) => {
    e.preventDefault();
    onNewColor(titleProps.value, colorProps.value);
    resetTitle();
    resetColor();
  };

  return (
    <form onSubmit={submit}>
      <input
        {...titleProps}
        type="text"
        placeholder="color title..."
        required
      />
      <input {...colorProps} type="color" required />
      <button>ADD</button>
    </form>
  );
};

const AppWithAddColorForm = () => {
  const [colors, setColors] = useState(colorData);
  return (
    <>
      <AddColorFormWithInputHook
        onNewColor={({ title, color }) => {
          const newColors = [
            ...colors,
            {
              id: v4(),
              rating: 0,
              title,
              color,
            },
          ];
          setColors(newColors);
        }}
      />
      <ColorList
        colors={colors}
        onRemoveColor={(id) => {
          const newColors = colors.filter((color) => color.id !== id);
          setColors(newColors);
        }}
        onRateColor={(id, rating) => {
          const newColors = colors.map((color) =>
            color.id === id ? { ...color, rating } : color
          );
          setColors(newColors);
        }}
      ></ColorList>
    </>
  );
};

// アプリケーションが大きくなるにつれ、コンポーネントツリーのルートからリーフまでpropsをリレーするのはきつくなってきた
// コンテキストの登場

// index.js
import colors from './color-data';

const ColorContext = createContext();
render(
  <ColorContext.Provider value={{ colors }}>
    <AppWithContext />
  </ColorContext.Provider>
);

// App.js
const AppWithContext = () => {
  return (
    <>
      <AddColorFormWithContext />
      <ColorListWithContext />
    </>
  );
};

// ColorList.js
const ColorListWithContext = () => {
  const { colors } = useContext(ColorContext);
  if (!colors.length) return <div>No Colors Listed. (Add a Color)</div>;
  return (
    <div>
      {colors.map((color) => (
        <Color key={color.id} {...color} />
      ))}
    </div>
  );
};

// ColorProvider.js
import colorData from './color-data.json';

const ColorContextForProvider = createContext();
export const useColors = () => useContext(ColorContextForProvider);

const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState(colorData);

  const addColor = (title, color) => {
    setColors([
      ...colors,
      {
        id: v4(),
        rating: 0,
        title,
        color,
      },
    ]);
  };

  const rateColor = (id, rating) => {
    setColors(
      colors.map((color) => (color.id === id ? { ...color, rating } : color))
    );
  };

  const removeColor = (id) => {
    setColors(colors.filter((color) => color.id !== id));
  };

  return (
    <ColorContextForProvider.Provider
      value={{ colors, addColor, rateColor, removeColor }}
    >
      {children}
    </ColorContextForProvider.Provider>
  );
};

// index.js with provider
render(
  <ColorProvider>
    <App />
  </ColorProvider>
);

// ColorList.js with provider
const ColorListWithProvider = () => {
  const { colors } = useColors();
  if (!colors.length) return <div>No Colors Listed. (Add a Color)</div>;
  return (
    <div>
      {colors.map((color) => (
        <Color key={color.id} {...color} />
      ))}
    </div>
  );
};

// Color.js
const ColorWithProvider = ({ id, title, color, rating }) => {
  const { rateColor, removeColor } = useColors();
  return (
    <section>
      <h1>{title}</h1>
      <button onClick={() => removeColor(id)}>
        <FaTrash />
      </button>
      <div style={{ height: 50, backgroundColor: color }} />
      <StarRating
        selectedStars={rating}
        onRate={(rating) => rateColor(id, color)}
      />
    </section>
  );
};

// AddColorForm.js
const AddColorFormWithProvider = () => {
  const [titleProps, resetTitle] = useInput('');
  const [colorProps, resetColor] = useInput('#000000');

  const { addColor } = useColors();

  const submit = (e) => {
    e.preventDefault();
    addColor(titleProps.value, colorProps.value);
    resetTitle();
    resetColor();
  };

  return (
    <form onSubmit={submit}>
      <input
        {...titleProps}
        type="text"
        placeholder="color title..."
        required
      />
      <input {...colorProps} type="color" required />
      <button>ADD</button>
    </form>
  );
};
