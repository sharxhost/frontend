import Card from "../Containers/Card";

interface TextCardProps {
  title: string;
  text: string;
  animation?: boolean;
  code?: boolean;
}

function TextCard({ title, text, animation = false, code = false }: TextCardProps): JSX.Element {
  return (
    <Card className='bg-slate-800 px-9 py-3' padding={false} animation={animation}>
      <p className="font-bold text-3xl">{title}</p>
      <p className="text-gray-300">
        {code ? <code>{text}</code> : text}
      </p>
    </Card>
  )
}

export default TextCard