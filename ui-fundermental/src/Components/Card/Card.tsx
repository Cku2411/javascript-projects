import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";

interface Props {
  title: string;
  description: string;
  price: string;
  badge?: string;
}

const Card = ({ title, description, price, badge }: Props) => {
  return (
    <div className="card-container">
      <CardHeader title={title} badge={badge} />
      <CardBody description={description} />
      <CardFooter price={price} />
    </div>
  );
};

export default Card;
