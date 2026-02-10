type Props = {
  price: string;
};

const CardFooter = ({ price }: Props) => {
  return (
    <div className="price-action">
      <span>{price}</span>
      <button>Buy now</button>
    </div>
  );
};

export default CardFooter;
