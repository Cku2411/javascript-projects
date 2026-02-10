type Props = {
  badge?: string;
  title: string;
};

const CardHeader = ({ badge, title }: Props) => {
  return (
    <>
      {badge && <div className="badge">new</div>}
      <h3>{title}</h3>
    </>
  );
};

export default CardHeader;
