npm install @capacitor/assets --save-dev
rm -rf android/app/src/main/res/mipmap-*
npx @capacitor/assets generate --android

cd android
./gradlew clean
cd ..

npx cap sync android
npx cap open android



unzip -l
     /Users/eldragon/git/elvisiongroup/android/app/build/outputs/apk/release/app
     -release-unsigned.apk

     To analyze the APK contents, you can use the following command in
    your terminal:

     1 unzip -l
       
  /Users/eldragon/git/elvisiongroup/android/app/build/outputs/apk/release/app
       -release-unsigned.apk

    This will list the files inside the APK, along with their sizes. You can
    then redirect this output to a file for easier analysis:

     1 unzip -l
       
  /Users/eldragon/git/elvisiongroup/android/app/build/outputs/apk/release/app
       -release-unsigned.apk > apk_contents.txt

    After you've run the command, you can examine the apk_contents.txt file to
    see which files are contributing the most to the APK's size. Look for large
    files in the assets or res directories, or large .dex files (which contain
    the compiled code). analyze mode

