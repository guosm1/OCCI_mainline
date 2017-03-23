Name:           occi 
Version:        1.0.0.0
Release:        1
Vendor:         AsiaInfo, Inc.
URL:            http://www.asiainfo.com
Packager:       AsiaInfo, Inc.<For more information, please contact your sales representative>
Summary:        OCCI service installation package. 
Group:          Applications/System
License:        Copyright AsiaInfo, Inc. 2016
Source0:        %{name}-%{version}.tar.gz
BuildArch:      x86_64 
Requires:       ambari-server >= 2.2.1.1
%define         userpath  /var/lib/ambari-server/resources/stacks/HDP/current/services
%define         stackpath /var/lib/ambari-server/resources/stacks/HDP
%define         jspath    /usr/lib/ambari-server/web/javascripts
Prefix:         %{userpath}
%define         _topdir %(echo $PWD)/dist
%description 
OCCI service installation package.

%pre
ambari_version=`rpm -q ambari-server|awk -F '-' '{print $3}'`
if [ $ambari_version = '2.2.1.1' ]
then
    ln -s %{stackpath}/2.4 %{stackpath}/current
else
    ln -s %{stackpath}/2.5 %{stackpath}/current
fi
%post
ambari_version=`rpm -q ambari-server|awk -F '-' '{print $3}'`
if [ $ambari_version = '2.2.1.1' ]
then
    mv -f %{jspath}/app.js.gz %{jspath}/app.js.gz.bak
    cp -f %{userpath}/OCCI/app.js.gz %{jspath}
    sed -i 's/2.5/2.4/g' %{userpath}/OCCI/alerts.json
fi

%postun
rm -f %{stackpath}/current
ambari_version=`rpm -q ambari-server|awk -F '-' '{print $3}'`
if [ $ambari_version = '2.2.1.1' ]
then
mv -f %{jspath}/app.js.gz.bak %{jspath}/app.js.gz
fi

%prep
%setup -c
%install
install -d $RPM_BUILD_ROOT%{userpath}
cp -a * $RPM_BUILD_ROOT%{userpath}
exit 0
%clean
rm -rf $RPM_BUILD_ROOT
rm -rf $RPM_BUILD_DIR/%{name}-%{version}
%files
%defattr(-,root,root)
%{userpath}

%changelog
