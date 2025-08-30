export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between">
        <div>
          <div className="font-bold">E-Suvidha</div>
          <p className="text-sm text-gray-300">Helping MSMEs access public tenders.</p>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="text-sm text-gray-300">Privacy</a>
          <a href="#" className="text-sm text-gray-300">Terms</a>
          <a href="#" className="text-sm text-gray-300">Contact</a>
        </div>
      </div>
    </footer>
  );
}
