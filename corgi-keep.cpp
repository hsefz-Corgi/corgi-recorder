#include <stdio.h>
#include <string.h>
#include <Windows.h>

auto main(void) -> int {
    char word[4096];
    while (1) {
        system("tasklist>corgi_log");
        FILE * fd = fopen("corgi_log", "r");
        bool hasReadCorgi = false;
        while (fscanf(fd, "%s", word) != EOF) {
            if (!strcmp(word, "CorgiRecorder.exe")) {
                hasReadCorgi = true;
                break;
            }
        }
        fclose(fd);
        if (!hasReadCorgi) {
            printf("Corgi Recorder not detected.");
            system("start CorgiRecorder.exe");
        } else printf("Corgi Recorder detected.");
        Sleep(1000);
    }
    return 0;
}
