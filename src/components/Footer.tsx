import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ProspectIQ · Powered by AI
        </p>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/shubhamc1947"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1.5 rounded-md hover:bg-secondary"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/in/shubhamchat03"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1.5 rounded-md hover:bg-secondary"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
