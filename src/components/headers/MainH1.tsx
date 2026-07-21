interface Props {
  header: string;
}

export const MainH1 = ({ header }: Props) => (
  <h1 className="text-2xl mt-4 uppercase">{header}</h1>
);
