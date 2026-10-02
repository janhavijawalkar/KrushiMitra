using System;
using System.IO;
using System.Diagnostics;
using System.Windows.Forms;

namespace KrushiMitraDesktop
{
    static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            try
            {
                // Target deployed production URL
                string targetUrl = "https://krushimitra.vercel.app/";

                // 1. Create native Windows desktop shortcut
                string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string shortcutPath = Path.Combine(desktopPath, "KrushiMitra.url");

                using (StreamWriter writer = new StreamWriter(shortcutPath))
                {
                    writer.WriteLine("[InternetShortcut]");
                    writer.WriteLine("URL=" + targetUrl);
                    writer.WriteLine("IconIndex=0");
                }

                // 2. Also place in Start Menu
                try
                {
                    string startMenu = Environment.GetFolderPath(Environment.SpecialFolder.StartMenu);
                    string programsFolder = Path.Combine(startMenu, "Programs");
                    if (Directory.Exists(programsFolder))
                    {
                        File.Copy(shortcutPath, Path.Combine(programsFolder, "KrushiMitra.url"), true);
                    }
                }
                catch { }

                // 3. Launch in standalone dedicated window mode
                bool launched = false;
                string[] browserPaths = new string[]
                {
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe")
                };

                foreach (string bPath in browserPaths)
                {
                    if (File.Exists(bPath))
                    {
                        Process.Start(new ProcessStartInfo
                        {
                            FileName = bPath,
                            Arguments = "--app=" + targetUrl,
                            UseShellExecute = true
                        });
                        launched = true;
                        break;
                    }
                }

                if (!launched)
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = targetUrl,
                        UseShellExecute = true
                    });
                }

                MessageBox.Show(
                    "✓ KrushiMitra Desktop App installed successfully!\nA shortcut has been created directly on your Desktop.\n\n✓ कृषीमित्र डेस्कटॉप ॲप यशस्वीरित्या इन्स्टॉल झाले!\nतुमच्या संगणकाच्या डेस्कटॉपवर थेट ॲप शॉर्टकट तयार करण्यात आला आहे.",
                    "KrushiMitra - Smart Farming AI",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information
                );
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "Note: " + ex.Message,
                    "KrushiMitra",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information
                );
            }
        }
    }
}
