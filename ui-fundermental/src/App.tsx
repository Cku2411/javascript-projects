import "./App.css";
import Card from "./Components/Card";

function App() {
  return (
    <div className="main">
      <div className="cards-holder">
        <Card
          title="Nike Air Max"
          description="Premium running shoes with advanced cushioning technology"
          price="$129.99"
          badge="Popular"
        />
        <Card
          title="AirPods Pro"
          description="Active noise cancellation for immersive sound"
          price="$249.99"
          badge="New"
        />
        <Card
          title="MacBook Pro"
          description="Supercharged by M3 chip for incredible performance"
          price="$1,999.99"
        />
      </div>
    </div>
  );
}

export default App;
