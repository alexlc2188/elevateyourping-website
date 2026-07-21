import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

export default function SafariInstallDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <Dialog.Panel className="max-w-md w-full bg-white rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <Dialog.Title className="text-lg font-bold text-slate-800">
                  Stay Awake Not Supported
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-slate-600 space-y-3">
                <p>
                  Your browser doesn’t support preventing screen sleep. Please
                  keep your screen on manually or use the app for best results.
                </p>
                <p>For best experience:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Keep your phone awake during practice</li>
                  <li>Use the app version for reliable background usage</li>
                </ul>
              </div>
              {/* TODO: add link to apple store app */}
              <div className="flex gap-3 mt-4">
                <a
                  href="https://apps.apple.com/app/idYOUR_APP_ID"
                  target="_blank"
                  rel="noopener noreferrer">
                  <img
                    src="/logos/apple-logo.svg"
                    alt="Download on the App Store"
                    className="h-10"
                  />
                </a>
                {/* TODO: add link to google play store app */}
                <a
                  href="https://play.google.com/store/apps/details?id=YOUR_PACKAGE_ID"
                  target="_blank"
                  rel="noopener noreferrer">
                  <img
                    src="/logos/google-play-logo.png"
                    alt="Get it on Google Play"
                    className="h-10"
                  />
                </a>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
