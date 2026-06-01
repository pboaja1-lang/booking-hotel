export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-high w-full py-stack-xl mt-stack-xl border-t border-outline-variant/20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="col-span-1 md:col-span-1 flex flex-col gap-stack-sm">
          <div className="font-headline-sm text-headline-sm text-primary dark:text-primary-fixed-dim mb-stack-md">
            Venellopy.io
          </div>
          <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim mt-stack-xs">
            Partner perjalanan terpercaya Anda untuk menemukan akomodasi terbaik
            di seluruh dunia.
          </p>
        </div>
        <div className="col-span-1 flex flex-col gap-stack-sm">
          <h4 className="font-label-md text-label-md text-on-surface">
            Perusahaan
          </h4>
          <a
            className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim hover:underline transition-opacity duration-200"
            href="#"
          >
            About Us
          </a>
          <a
            className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim hover:underline transition-opacity duration-200"
            href="#"
          >
            Hotel Partners
          </a>
        </div>
        <div className="col-span-1 flex flex-col gap-stack-sm">
          <h4 className="font-label-md text-label-md text-on-surface">
            Bantuan
          </h4>
          <a
            className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim hover:underline transition-opacity duration-200"
            href="#"
          >
            Contact Support
          </a>
        </div>
        <div className="col-span-1 flex flex-col gap-stack-sm">
          <h4 className="font-label-md text-label-md text-on-surface">Legal</h4>
          <a
            className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim hover:underline transition-opacity duration-200"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim hover:underline transition-opacity duration-200"
            href="#"
          >
            Privacy Policy
          </a>
        </div>
      </div>
      <div className="mt-stack-xl pt-stack-md border-t border-outline-variant/20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center md:text-left">
        <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim">
          © 2024 Venellopy.io. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
