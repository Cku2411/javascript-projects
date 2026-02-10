type Props = {
  description: string;
};

const CardBody = ({ description }: Props) => {
  return <p>{description}</p>;
};

export default CardBody;
